db = db.getSiblingDB('dataCave');

db.createUser({
  user: 'main',
  pwd: 'main',
  roles: [
    {
      role: 'readWrite',
      db: 'dataCave',
    },
  ],
});

db.createCollection('test');
