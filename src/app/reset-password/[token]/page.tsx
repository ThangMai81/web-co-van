import { ResetPassword } from "@/components/auth/ResetPassword";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ResetPassword token={token} />;
}
