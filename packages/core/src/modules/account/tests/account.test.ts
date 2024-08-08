import { createTestUser, waitFor } from "../../../utils/tests";
import { describe, expect, it } from "vitest";

import { getUserAccount } from "../../../shared";

describe("Account", () => {
  it("should create", async () => {
    const user = await createTestUser();

    const account = await waitFor(
      () => getUserAccount(user.id),
      account => !!account,
      10,
      2000
    );
    expect(account.userId).toBe(user.id);
    expect(account.balance).toBe("0.00");
  }, 20000);
});
