import { describe, expect, it } from "vitest";

import { Api } from "sst/node/api";
import { User } from "../models";
import { createTestUser } from "../../../utils/tests";

describe("User", () => {
  it("should create", async () => {
    const firstName = "Satoshi";
    const lastName = "Nakomoto";
  
    const user = await createTestUser(firstName, lastName);

    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);

    const getUserResponse = await fetch(`${Api.api.url}/user/${user.id}`, {
      method: "GET",
    });

    expect(getUserResponse.status).toBe(200);
    const getUser = (await getUserResponse.json()) as User;
    expect(getUser.firstName).toBe(firstName);
    expect(getUser.lastName).toBe(lastName);
  }, 20000);
});
