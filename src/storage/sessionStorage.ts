import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "matrimony_mobile_token";
const USER_KEY = "matrimony_mobile_user";

export type PersistedUser = Record<string, unknown> | null;

export async function loadSession() {
  const [token, user] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);

  return {
    token,
    user: user ? (JSON.parse(user) as PersistedUser) : null,
  };
}

export async function saveSession(token: string | null, user: PersistedUser) {
  const tasks: Promise<void>[] = [];

  if (token) {
    tasks.push(AsyncStorage.setItem(TOKEN_KEY, token));
  } else {
    tasks.push(AsyncStorage.removeItem(TOKEN_KEY));
  }

  if (user) {
    tasks.push(AsyncStorage.setItem(USER_KEY, JSON.stringify(user)));
  } else {
    tasks.push(AsyncStorage.removeItem(USER_KEY));
  }

  await Promise.all(tasks);
}

export async function clearSession() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}
