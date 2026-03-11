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

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="grid grid-cols-2 items-center py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
      {label}
    </span>
    <span className="text-sm font-semibold text-right md:text-left" style={{ color: 'var(--stone)' }}>
      {value || '-'}
    </span>
  </div>
);

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

const SectionCard = ({ title, children }: SectionCardProps) => (
  <section
    className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
    style={{ boxShadow: 'var(--shadow-soft)' }}
  >
    <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--mist)' }}>
        {title}
      </h2>
    </div>
    <div className="px-6 pb-4">
      {children}
    </div>
  </section>
);

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
    <div className="p-4 md:p-8 w-full md:max-w-2xl" style={{ background: 'var(--sand)', minHeight: '100%' }}>
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--stone)' }}>
          Mon profil
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--mist)' }}>
          Vos informations personnelles et vos familles
        </p>
      </div>

      <div className="space-y-4">
        {/* Avatar + name hero */}
        <div
          className="bg-white rounded-[var(--radius-lg)] px-6 py-6 flex items-center gap-5"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold font-display text-white flex-none"
            style={{ background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }}
          >
            {(userState.firstName?.[0] || userState.username?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
              {userState.firstName && userState.lastName
                ? `${userState.firstName} ${userState.lastName}`
                : userState.username || 'Utilisateur'}
            </p>
          </div>
        </div>

        {/* Informations */}
        <SectionCard title="Informations">
          <InfoRow label="Username" value={userState.username} />
          <InfoRow label="Prénom" value={userState.firstName} />
          <InfoRow label="Nom" value={userState.lastName} />
          <InfoRow label="Email" value={userEmail} />
        </SectionCard>

        {/* Rôles */}
        <SectionCard title="Mon rôle">
          {roles.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-3">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                  style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
                >
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm py-3" style={{ color: 'var(--mist)' }}>
              Aucun rôle rattaché pour le moment.
            </p>
          )}
        </SectionCard>

        {/* Familles */}
        <SectionCard title="Familles">
          {memberships.length > 0 ? (
            <div className="divide-y divide-black/[0.04]">
              {memberships.map(({ family, role }) => (
                <div key={family.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--stone)' }}>
                      {family.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>
                      {getMemberCount(family)} membre{getMemberCount(family) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                    style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
                  >
                    {role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm py-3" style={{ color: 'var(--mist)' }}>
              Aucune famille associée pour le moment.
            </p>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export const Profile = withFetchTemplate<any, Family[]>(ProfileContent, useFetchFamilies);
