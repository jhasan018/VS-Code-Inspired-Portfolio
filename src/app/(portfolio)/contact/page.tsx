import { Metadata } from "next";
import ContactClient from "@/components/pages/ContactClient";
import { ContactPage as DimensionContact } from "@/themes/dimension/DimensionPages";
import { getActiveTheme } from "@/lib/theme";
import { createAnonClient } from "@/lib/supabase/server";
import { getMetadata, getPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("contact");
}

export const revalidate = 60;

export default async function ContactPage() {
  const supabase = createAnonClient();
  const { data: profile } = await supabase.from("profile").select("*").single();
  const schema = await getPageSchema("contact");
  const theme = await getActiveTheme();

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {theme === "dimension" ? <DimensionContact profile={profile} /> : <ContactClient profile={profile} />}
    </>
  );
}
