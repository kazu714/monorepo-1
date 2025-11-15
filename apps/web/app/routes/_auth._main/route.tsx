import { Form, Outlet, type ActionFunctionArgs } from "react-router";
import { logout } from "~/util/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("ログアウトアクションが呼ばれました");
  return await logout(request);
};

export default function Main() {
  return (
    <div>
      <header>
        <h1>Auth Main Layout</h1>
        <div>
          <Form method="post" action="/api/logout">
            <input type="submit" value="Logout" />
          </Form>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
