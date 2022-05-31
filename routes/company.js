const express = require('express');
const { connection } = require('../db/config');
const { parseToken } = require('../utils/jwt');
const Snowflake = require('../utils/snowFlake');

const router = express.Router();
const snowflake = new Snowflake();

function totalNum(table = 'company') {
  return new Promise((resolve) => {
    const sql = `select count(*) from ${table}`;
    connection.query(sql, (err, res) => {
      if (err) {
        resolve(0);
      }
      resolve(res[0]['count(*)']);
    });
  });
}

function getCompanyNum(name) {
  return new Promise((resolve) => {
    const sql = `select count(*) from company where name like '%${name}%'`;
    connection.query(sql, (err, res) => {
      if (err) {
        resolve(0);
      }
      resolve(res[0]['count(*)']);
    });
  });
}

function dealAvgByCompanyId(companyId) {
  return new Promise((resolve) => {
    const sql = `select avg(score) from company_comment where company_id = ${companyId}`;
    connection.query(sql, (err, res) => {
      if (err) {
        resolve(0);
      }
      const avg = Number(res[0]['avg(score)']);
      resolve(avg.toFixed(0));
    });
  });
}

async function updateScore(companyId) {
  const score = await dealAvgByCompanyId(companyId);
  return new Promise((resolve) => {
    const sql = `update company set score = ${score} where id = ${companyId}`;
    connection.query(sql, (err, res) => {
      if (err) {
        resolve(0);
      }
      resolve(res);
    });
  });
}

let companyTotal = 0;
totalNum().then((res) => {
  companyTotal = res;
});

router.get('/list', (req, resp) => {
  const {
    search,
    page,
    pageSize,
    sortType,
  } = req.query;
  let sql = 'select * from company where 1=1 ';

  if (search) {
    sql += ` and INSTR(name,'${search}')>0 `;
  }
  sql += ` order by score ${Number(sortType) === 0 ? 'asc' : 'desc'}`;

  if (page) {
    sql += ` limit ${(page - 1) * pageSize}, ${pageSize}`;
  }

  connection.query(sql, (err, res) => {
    if (err) {
      resp.send(err);
      return;
    }
    resp.send({
      code: 200,
      message: 'success',
      data: res,
      total: companyTotal,
    });
  });
});

router.get('/detail', (req, resp) => {
  const { id } = req.query;
  const sql = `select * from company_comment where company_id = ${id}`;

  connection.query(sql, (err, res) => {
    if (err) {
      resp.send(err);
      return;
    }
    resp.send({
      code: 200,
      message: 'success',
      data: res,
    });
  });
});

router.post('/add-comment', (req, resp) => {
  const {
    companyId,
    comment,
    score,
    pay,
  } = req.body;

  const user = parseToken(req.headers.token);
  const id = snowflake.generate();
  const userId = user.id;
  const sql = `insert into company_comment (id, company_id, user_id, comment, score, pay) values ('${id}','${companyId}', '${userId}', '${comment}', '${score}', '${pay}')`;

  connection.query(sql, async (err) => {
    if (err) {
      resp.send(err);
      return;
    }
    await updateScore(companyId);
    resp.send({
      code: 200,
      message: 'success',
      data: '',
    });
  });
});

router.post('/add', async (req, resp) => {
  const { name, score, comment } = req.body;
  const isExist = await getCompanyNum(name);
  if (isExist > 0) {
    resp.send({
      code: 400,
      message: '该公司已存在',
      data: '',
    });
    return;
  }
  const user = parseToken(req.headers.token);

  const id = snowflake.generate();
  const comment_id = snowflake.generate();
  const userId = user.id;
  const sql = `insert into company (id,name, score, comment,user_id) values ('${id}','${name}', '${score}', '${comment}', '${userId}')`;
  const insertSql = `insert into company_comment (id, company_id, user_id, comment, score, pay) values ('${comment_id}','${id}', '${userId}', '${comment}', '${score}', '12000')`;

  connection.query(sql, (err) => {
    if (err) {
      resp.send(err);
      return;
    }
    resp.send({
      code: 200,
      message: 'success',
      data: '',
    });
  });

  connection.query(insertSql, (err) => {
    if (err) {
      resp.send(err);
    }
  });
});

module.exports = router;
