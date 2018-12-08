const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req, res) => {
  const queryText = 'SELECT id, name, rank FROM plant ORDER BY rank';
  pool.query(queryText)
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
    });
});

router.get('/details/:id', (req, res) => {
  const queryText = 'SELECT * FROM plant WHERE id=$1';
  pool.query(queryText, [req.params.id])
    .then((result) => { res.send(result.rows); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  const newPlant = req.body;
  const queryText = `INSERT INTO plant ("name", "kingdom", "clade", "order", "family", "subfamily", "genus", "rank")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const queryValues = [
    newPlant.name,
    newPlant.kingdom,
    newPlant.clade,
    newPlant.order,
    newPlant.family,
    newPlant.subfamily,
    newPlant.genus,
    newPlant.rank,
  ];
  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(201); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
    });
});

router.put('/order1', (req, res) => {

  console.log('in router put order 1', req.body.params);
  
  // First update current to 0
  let queryText = `UPDATE plant SET rank=0 WHERE rank=$1`;
  let queryValues = [req.body.params.old];

  pool.query(queryText, queryValues)
    .then(() => { 
      console.log('update OK for order1');
      res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
  });
  
});

router.put('/order2', (req, res) => {

  console.log('in router put order 2', req.body.params);
  let queryText = '';
  let queryValues = [];
  // Determine if moving down or up
  if (req.body.params.new > req.body.params.old) {
   queryText = `UPDATE plant SET rank = (rank - 1) 
                    WHERE rank > $1
                    AND rank<=$2`;
    queryValues = [req.body.params.old, req.body.params.new];
  } else {
    queryText = `UPDATE plant SET rank = (rank + 1) 
                    WHERE rank >= $1 AND rank < $2`;
    queryValues = [req.body.params.new, req.body.params.old];
  }

  pool.query(queryText, queryValues)
    .then(() => { 
      console.log('update OK');
      res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
  });  
});

router.put('/order3', (req, res) => {

  console.log('in router put order 3', req.body);
  
  // First update current to 0
  let queryText = `UPDATE plant SET rank = $1 WHERE rank=0`;
  let queryValues = [req.body.params.new];

  pool.query(queryText, queryValues)
    .then(() => { 
      console.log('update OK');
      res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
  });
});

router.delete('/', (req, res) => {
  console.log('in delete on server', req.query.id);
  const queryText = 'DELETE FROM plant WHERE id=$1';
  pool.query(queryText, [req.query.id])
    .then(() => { res.sendStatus(200); })
    .catch((err) => {
      console.log('Error completing SELECT plant query', err);
      res.sendStatus(500);
    });
});

module.exports = router;
