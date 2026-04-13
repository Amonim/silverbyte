import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ProfileSection from "../sections/ProfileSection";

function ProfilePage() {
  return (
    <>
      <Header />
      <main>
        <ProfileSection />
      </main>
      <Footer />
    </>
  );
}

export default ProfilePage;
