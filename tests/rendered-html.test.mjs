import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("trang chính có các nghiệp vụ theo dõi chi phí", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Bình quân sinh hoạt/);
  assert.match(page, /Thêm món đồ/);
  assert.match(page, /monthlyCost/);
  assert.match(page, /setItems/);
});
