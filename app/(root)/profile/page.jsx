export const dynamic = "force-dynamic";

import React from "react";
import { getCurrentUserData } from "../../../modules/profile/actions";
import UserInfoCard from "../../../modules/profile/components/user-info-card";
import ProfileStates from "../../../modules/profile/components/profile-stats";
import SubmissionsHistory from "../../../modules/profile/components/submission-history";
import PlaylistsSection from "../../../modules/profile/components/playlist-section";
import SolvedProblems from "../../../modules/profile/components/solved-problems";

const ProfilePage = async () => {
  const profileData = await getCurrentUserData();

  if (!profileData) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard userData={profileData} />
        <ProfileStates
          submissions={profileData.submissions || []}
          solvedCount={profileData.solvedProblems?.length || 0}
          playlistCount={profileData.playlists?.length || 0}
        />
        <SubmissionsHistory submissions={profileData.submissions || []} />

        <div className="grid gap-8">
          <SolvedProblems solvedProblems={profileData.solvedProblems || []} />
          <PlaylistsSection playlists={profileData.playlists || []} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
