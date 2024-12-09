import { Metadata } from "next";
import UserAuthForm from "@/app/components/UserAuthForm";
import AuthServer from "@/app/controllers/Auth.server";
import { sendResponseServer } from "@/app/helpers/SendResponse.server";

async function signUp(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await AuthServer.signUp(name, email, password);
    return result;
  } catch {
    return sendResponseServer<null>({
      status: 'error',
      message: 'حدث خطأ أثناء التسجيل',
      data: null,
      code: 400,
      action: 'sign-up'
    })
  }
}

export const metadata: Metadata = {
  title: "تسجيل حساب جديد 🔒",
  description: "قم بتسجيل حساب جديد للوصول إلى جميع الميزات والخدمات",
  keywords: "تسجيل حساب جديد, حساب مستخدم, مصادقة, حساب جديد",
  openGraph: {
    title: "تسجيل حساب جديد",
    description: "قم بتسجيل حساب جديد للوصول إلى جميع الميزات والخدمات",
    type: "website",
    locale: "ar",
  },
};

export default async function SignUpPage() {
  return <UserAuthForm type="sign-up" signUp={signUp} />;
}