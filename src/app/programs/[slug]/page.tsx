import ProgramDetailPage from "@/components/programs/ProgramDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProgramDetailPage slug={slug} />;
}
