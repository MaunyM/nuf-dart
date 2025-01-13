import { Joueur, JoueurCricket } from "@/app/Type/Game";
import { GetServerSideProps } from "next";
import Link from 'next/link'
import { useAuth } from "react-oidc-context";


export default function Page() {
  const auth = useAuth();
    return <div>
     Login
        </div>
  }