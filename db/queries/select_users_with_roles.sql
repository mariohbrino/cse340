SELECT
  "u"."name",
  "u"."email",
  "u"."role_id",
  "r"."role_name",
  "u"."created_at"
FROM
  "user" AS "u"
JOIN
  "role" AS "r"
ON "u"."role_id" = "r"."role_id";
