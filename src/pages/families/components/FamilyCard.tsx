import { Users, User, Settings, ShieldAlert, Shield } from 'lucide-react';
import type { Family } from '../../../stores/families/families.types';
import { FAMILY_RELATION_LABELS } from '../../../stores/families/families.types';

interface FamilyCardProps {
  family: Family;
  isPendingDeactivation: boolean;
  onEdit: (family: Family) => void;
  onDeactivate: (family: Family) => void;
}

const getMemberCount = (family: Family): number => family.members.length + 1;

export const FamilyCard = ({ family, isPendingDeactivation, onEdit, onDeactivate }: FamilyCardProps) => (
  <div
    className="bg-white rounded-[var(--radius-lg)] overflow-hidden flex flex-col relative"
    style={{ boxShadow: 'var(--shadow-soft)' }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-1"
      style={{ background: 'linear-gradient(to right, var(--ocean), var(--sage-light))' }}
      aria-hidden="true"
    />

    <div className="p-6 pt-7 flex flex-col flex-1">
      {/* Title row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-bold m-0" style={{ color: 'var(--stone)' }}>
            {family.name}
          </h2>
          <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--mist)' }}>
            <Users className="w-3.5 h-3.5" />
            <span>{getMemberCount(family)} membre{getMemberCount(family) > 1 ? 's' : ''}</span>
          </div>
        </div>
        {family.status === 'ACTIVE' ? (
          <span
            className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
            style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
          >
            Actif
          </span>
        ) : (
          <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-gray-100 text-gray-400">
            Désactivé
          </span>
        )}
      </div>

      {/* Owner */}
      <div
        className="rounded-[var(--radius-sm)] p-3 flex items-center justify-between mb-4"
        style={{ background: 'var(--sand)' }}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide m-0 mb-0.5" style={{ color: 'var(--mist)' }}>
            Propriétaire · {FAMILY_RELATION_LABELS[family.owner.relation]}
          </p>
          <p className="text-sm font-medium m-0 truncate max-w-[180px]" style={{ color: 'var(--stone)' }}>
            {family.owner.email}
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
          style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
        >
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* Members */}
      <div className="flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-2 m-0" style={{ color: 'var(--mist)' }}>
          Membres
        </p>
        <ul className="list-none p-0 m-0 space-y-1">
          {family.members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between text-sm py-1.5 border-b border-black/5 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--sand)', color: 'var(--mist)' }}
                >
                  {FAMILY_RELATION_LABELS[member.relation]}
                </span>
                {member.isAdmin && (
                  <span title="Admin">
                    <Shield className="w-3 h-3" style={{ color: 'var(--ocean)' }} />
                  </span>
                )}
              </div>
              <span className="text-sm font-medium truncate max-w-[160px]" style={{ color: 'var(--stone)' }}>
                {member.email}
              </span>
            </li>
          ))}
          {family.members.length === 0 && (
            <li className="text-sm py-2 italic" style={{ color: 'var(--mist)' }}>
              Aucun autre membre
            </li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 pt-5 mt-5 border-t border-black/5">
        <button
          className="flex-1 flex items-center justify-center gap-2 border text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--ocean-pale)] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)', background: 'transparent' }}
          onClick={() => onEdit(family)}
          disabled={family.status === 'INACTIVE'}
        >
          <Settings className="w-3.5 h-3.5" />
          Modifier
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 border text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--coral-pale)] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: 'var(--coral)', color: 'var(--coral)', background: 'transparent' }}
          onClick={() => onDeactivate(family)}
          disabled={family.status === 'INACTIVE' || isPendingDeactivation}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Désactiver
        </button>
      </div>
    </div>
  </div>
);
