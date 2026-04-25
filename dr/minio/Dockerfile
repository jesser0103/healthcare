FROM alpine:3.20

RUN apk add --no-cache ca-certificates curl \
  && curl -fsSL https://dl.min.io/server/minio/release/linux-amd64/minio -o /usr/local/bin/minio \
  && chmod +x /usr/local/bin/minio \
  && curl -fsSL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc \
  && chmod +x /usr/local/bin/mc

RUN adduser -D -u 1000 minio
RUN mkdir -p /data && chown -R 1000:1000 /data

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER 1000
EXPOSE 9000 9001

ENTRYPOINT ["/entrypoint.sh"]
