#!/usr/bin/env sh
set -eu

RS_NAME="${MONGO_REPLICA_SET_NAME:-rs0}"
PRIMARY_HOST="${MONGO_PRIMARY_HOST:-mongo-primary}"
SECONDARY_HOST="${MONGO_SECONDARY_HOST:-mongo-secondary}"
ARBITER_HOST="${MONGO_ARBITER_HOST:-mongo-arbiter}"
MONGO_PORT="${MONGO_PORT:-27017}"

echo "[init-replica] waiting for mongod on ${PRIMARY_HOST}:${MONGO_PORT}..."
until mongosh --host "${PRIMARY_HOST}:${MONGO_PORT}" --quiet --eval "db.adminCommand({ ping: 1 }).ok" | grep -q "1"; do
  sleep 2
done

echo "[init-replica] initiating replica set ${RS_NAME}..."

mongosh --host "${PRIMARY_HOST}:${MONGO_PORT}" --quiet <<EOF
const rsName = "${RS_NAME}";
const config = {
  _id: rsName,
  members: [
    { _id: 0, host: "${PRIMARY_HOST}:${MONGO_PORT}", priority: 2 },
    { _id: 1, host: "${SECONDARY_HOST}:${MONGO_PORT}", priority: 1 },
    { _id: 2, host: "${ARBITER_HOST}:${MONGO_PORT}", arbiterOnly: true }
  ]
};

try {
  const status = rs.status();
  print("Replica set already initialized:");
  printjson(status);
} catch (e) {
  print("Initializing replica set...");
  rs.initiate(config);
}

// wait until PRIMARY elected
let attempts = 0;
while (attempts < 60) {
  const s = rs.status();
  const primary = s.members.find(m => m.stateStr === 'PRIMARY');
  if (primary) {
    print("PRIMARY elected: " + primary.name);
    break;
  }
  attempts++;
  sleep(1000);
}
EOF

echo "[init-replica] done"
