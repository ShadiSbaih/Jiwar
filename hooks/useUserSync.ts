import { upsertUser } from "@/services/users";
import { userUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = userUserStore((state) => state.setIsAdmin);
  const authSupabase = useSupabase();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsSyncing(false);
      return;
    }
    syncUser();
  }, [user]);

  const syncUser = async () => {
    setIsSyncing(true);
    try {
      const record = await upsertUser(
        {
          clerk_id: user!.id,
          email: user!.emailAddresses[0].emailAddress,
          first_name: user!.firstName,
          last_name: user!.lastName,
          avatar_url: user!.imageUrl,
        },
        authSupabase,
      );

      setIsAdmin(record?.is_admin ?? false);
    } finally {
      setIsSyncing(false);
    }
  };

  return { isSyncing };
};
