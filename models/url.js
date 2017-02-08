var db = [];

var offset = 100000;

function create(url, cb) {
  db.push(url);

  cb(null, db.length + offset);
}

function getById(id, cb) {
  id -= offset + 1;

  if (id < 0) {
    cb(new Error('id must be positive integer'));
  }

  return cb(null, db[id] || null);
}

module.exports = {
  create: create,
  getById: getById
};