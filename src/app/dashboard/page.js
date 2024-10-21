// pages/dashboard.js
"use client"
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Chart, RealTimeCard, TrendChart } from "@/components/ui/percentChart";
import Loader from "@/components/ui/loader";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        setLoading(false);
      } else {
      
        router.push("/login");
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  if (loading) return <Loader/>;

  return (
    <div className="p-4">
      <Chart/>
      <RealTimeCard/>
      {/* <TrendChart/> */}
    </div>
  );
}

export default Dashboard;
