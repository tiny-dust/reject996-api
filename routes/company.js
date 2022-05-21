const express = require('express');
const { connection } = require('../db/config');

const router = express.Router();

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
      msg: 'success',
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
      msg: 'success',
      data: res,
    });
  });
});

module.exports = router;
