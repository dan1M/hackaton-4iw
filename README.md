This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


  

   <div style={{ textAlign: "center", cursor: "pointer" }}>
        {type === "event" && user && (
          <Button
            text={inscription ? "Se désinscrire" : "S'inscrire"}
            onClick={() => handleRegisterEvent(id)}
          />
        )}
        {type === "event" && !user && ( 
          <p>Please log in to register for this event.</p>
        )}
      </div>



     const isUserRegisteredForEvent = async (eventId, profileId, supabaseClient) => {
    try {
      const { data, error } = await supabaseClient
        .from("profilesevents")
        .select("*")
        .eq("event_id", eventId)
        .eq("profile_id", profileId)
        .single();
  
      if (data) {
        
        return true;
      } else {
      
        return false;
      }
    } catch (error) {
      console.error("Error checking event registration:", error.message);
      return false;
    }
  };



  useEffect(() => {
    const fetchInscriptionStatus = async () => {
      if (type === "event" && user) {
        const isRegistered = await isUserRegisteredForEvent(id, user.id, supabaseClient);
        setInscription(isRegistered);
      }
    };
    fetchInscriptionStatus();
  }, [type, id, user, supabaseClient]);

  const handleRegisterEvent = async (eventId) => {
    try {
      if (!user) {
        console.log('User not logged in. Please log in to register for the event.');
        return;
      }
  
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();
  
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }
  
      const profileId = profileData?.id;
  
      if (!profileId) {
        console.log('User profile ID not found.');
        return;
      }
  
      if (await isUserRegisteredForEvent(eventId, profileId, supabaseClient)) {
        const { data, error } = await supabaseClient
          .from('profilesevents')
          .delete()
          .eq('event_id', eventId)
          .eq('profile_id', profileId);
  
        if (data) {
          console.log('User unregistered from the event successfully!');
          setInscription(false);
          fetchEvents();
        } else {
          console.error('Error unregistering user from the event:', error);
        }
      } else {
        const { data, error } = await supabaseClient
          .from('profilesevents')
          .insert([{ event_id: eventId, profile_id: profileId }]);
  
        if (data) {
          console.log('User registered for the event successfully!');
          setInscription(true);
          fetchEvents();
        } else {
          console.error('Error registering user for the event:', error);
        }
      }
    } catch (error) {
      console.error('Error registering/unregistering user for the event:', error.message);
    }
  };
  
  