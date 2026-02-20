import './Profile.scss';
import { useMemo } from 'react';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template';
import { useFetchFamilies } from '../../stores/families/families.queries';
import type { Family } from '../../stores/families/families.types';
import { useUser } from '../../contexts/user/user.context';

interface FamilyMembership {
  family: Family;
  role: string;
}

const getMemberCount = (family: Family): number => family.members.length + 1;

const getUserEmail = (username: string, email: string): string => {
  if (email) {
    return email;
  }

  if (username) {
    return `${username}@banana.fr`;
  }

  return '';
};

const getMemberships = (families: Family[], userEmail: string): FamilyMembership[] => {
  return families
    .map((family) => {
      if (family.owner.email === userEmail) {
        return { family, role: family.owner.relation ?? 'Owner' };
      }

      const member = family.members.find((item) => item.email === userEmail);
      if (member) {
        return { family, role: member.relation ?? 'Member' };
      }

      return null;
    })
    .filter((item): item is FamilyMembership => item !== null);
};

const ProfileContent = ({ data }: { data: Family[] }) => {
  const { userState } = useUser();
  const userEmail = useMemo(
    () => getUserEmail(userState.username, userState.email),
    [userState.username, userState.email]
  );

  const memberships = useMemo(() => getMemberships(data, userEmail), [data, userEmail]);
  const roles = useMemo(
    () => Array.from(new Set(memberships.map((membership) => membership.role))),
    [memberships]
  );

  return (
    <div className="profile-page">
      <section className="profile-card">
        <h2>Informations</h2>
        <div className="profile-info">
          <div>
            <span>Username</span>
            <strong>{userState.username || '-'}</strong>
          </div>
          <div>
            <span>Prénom</span>
            <strong>{userState.firstName || '-'}</strong>
          </div>
          <div>
            <span>Nom</span>
            <strong>{userState.lastName || '-'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{userEmail || '-'}</strong>
          </div>
        </div>
      </section>

      <section className="profile-card">
        <h2>Mon rôle</h2>
        {roles.length > 0 ? (
          <div className="profile-tags">
            {roles.map((role) => (
              <span key={role} className="profile-tag">{role}</span>
            ))}
          </div>
        ) : (
          <p className="profile-empty">Aucun rôle rattaché pour le moment.</p>
        )}
      </section>

      <section className="profile-card">
        <h2>Familles</h2>
        {memberships.length > 0 ? (
          <ul className="profile-families">
            {memberships.map(({ family, role }) => (
              <li key={family.id}>
                <div>
                  <strong>{family.name}</strong>
                  <span>{getMemberCount(family)} membres</span>
                </div>
                <span className="profile-family-role">{role}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="profile-empty">Aucune famille associée pour le moment.</p>
        )}
      </section>
    </div>
  );
};

export const Profile = withFetchTemplate<any, Family[]>(ProfileContent, useFetchFamilies);
