import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Title from "@/components/Title";
import { useRouter } from "next/router";
import Image from "next/image";

export default function ProfileEvent({ client }) {
  const { supabaseClient } = useSessionContext();
  const [clientData, setClientData] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const showDetails = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .eq("id", client.id);
      console.log(client.id);
      console.log(id);
      console.log(client.image_name);
      const { data: publicUrl } = await supabaseClient.storage
        .from("uploads")
        .getPublicUrl(`contents/${client.image_name}`);
      data[0].imageUrl = publicUrl.publicUrl;
      if (data) {
        setClientData(data[0]);
      }
    } catch (error) {
      console.error("Error fetching client:", error.message);
    }
  };

  useEffect(() => {
    showDetails();
  }, []);

  return (
    <div className="mt-12">
      <Title text="Détails du client" />
      <div>
        {clientData && (
          <div className="border rounded-lg shadow-md p-4">
            <div className="mb-4">
              <p className="text-lg font-bold">Nom du projet:</p>
              <p>{clientData.name}</p>
              <Image
                className="w-16 h-16 rounded-full mr-8 shadow-lg"
                src={clientData.imageUrl}
                alt=""
                width={50}
                height={50}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
