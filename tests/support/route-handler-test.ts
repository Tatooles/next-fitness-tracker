import { vi } from "vitest";
import {
  createRouteTestDatabase,
  destroyRouteTestDatabase,
  type RouteTestDatabase,
} from "@/tests/support/route-test-db";

const routeTestMocks = vi.hoisted(() => ({
  authMock: vi.fn(),
  authState: {
    userId: null as string | null,
  },
  dbRef: {
    current: null as RouteTestDatabase["db"] | null,
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: routeTestMocks.authMock,
}));

vi.mock("@/db/drizzle", () => ({
  get db() {
    if (!routeTestMocks.dbRef.current) {
      throw new Error("Test database has not been initialized");
    }

    return routeTestMocks.dbRef.current;
  },
}));

export function setRouteTestUserId(userId: string | null) {
  routeTestMocks.authState.userId = userId;
}

export async function setupRouteTestDatabase(
  options?: Parameters<typeof createRouteTestDatabase>[0],
) {
  const database = await createRouteTestDatabase(options);
  routeTestMocks.dbRef.current = database.db;
  setRouteTestUserId("user-1");
  routeTestMocks.authMock.mockImplementation(async () => ({
    userId: routeTestMocks.authState.userId,
  }));

  return database;
}

export async function teardownRouteTestDatabase(database: RouteTestDatabase) {
  routeTestMocks.dbRef.current = null;
  setRouteTestUserId(null);
  await destroyRouteTestDatabase(database);
}
