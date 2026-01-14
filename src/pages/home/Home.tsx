import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template.tsx';
import { DashboardData, ItemVisibility } from '../../stores/dashboard/dashboard.types.ts';
import { useFetchDashboard } from '../../stores/dashboard/dashboard.queries.ts';
import './Home.scss';

const getVisibilityLabel = (visibility: ItemVisibility) => {
  return visibility === 'PERSONAL' ? 'Personnel' : 'Famille';
}

const HomeContent = ({ data }: { data: DashboardData }) => {
  const upcomingEvents = data.agenda.length;
  const activeTodos = data.todos.filter((todo) => !todo.completed).length;
  const favoriteRecipes = data.recipes.filter((recipe) => recipe.favorite).length;

  return (
    <div className="dashboard">
      <div className="dashboard__grid">
        <section className="card card--agenda">
          <div className="card__header">
            <div className="card__title">
              <span className="card__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3v2H5a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a2 2 0 0 0-2-2h-2V3h-2v2H9V3H7Zm12 8H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7Z" />
                </svg>
              </span>
              <h2>Agenda familial</h2>
            </div>
            <button className="card__menu" type="button" aria-label="Options agenda">...</button>
          </div>
          <ul className="agenda-list">
            {data.agenda.map((event) => (
              <li key={event.id} className="agenda-list__item">
                <span className="agenda-list__dot" style={{ backgroundColor: event.accentColor }} aria-hidden="true" />
                <div className="agenda-list__details">
                  <p className="agenda-list__title">{event.title}</p>
                  <p className="agenda-list__meta">{event.time} · {event.person}</p>
                  <span className={`badge badge--${event.visibility.toLowerCase()}`}>{getVisibilityLabel(event.visibility)}</span>
                </div>
                <div className="avatar-stack">
                  {event.attendees.slice(0, 2).map((name) => (
                    <span key={name} className="avatar-stack__item">{name.charAt(0)}</span>
                  ))}
                  {event.attendees.length > 2 ? (
                    <span className="avatar-stack__count">+{event.attendees.length - 2}</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <button className="card__action" type="button">
            Voir le calendrier
            <span aria-hidden="true">{'>'}</span>
          </button>
        </section>

        <section className="card card--todos">
          <div className="card__header">
            <div className="card__title">
              <span className="card__icon card__icon--square">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 12.5 10.5 16 17 9.5l-1.4-1.4-5.1 5.1L8.4 11.1 7 12.5Z" />
                  <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v12h14V6H5Z" />
                </svg>
              </span>
              <h2>Todos familiaux</h2>
            </div>
            <button className="card__menu" type="button" aria-label="Options todos">...</button>
          </div>
          <ul className="todo-list">
            {data.todos.map((todo) => (
              <li key={todo.id} className="todo-list__item">
                <span className="todo-list__avatar">{todo.assignee.charAt(0)}</span>
                <div className="todo-list__details">
                  <p className={todo.completed ? 'is-done' : ''}>{todo.label}</p>
                  <span className={`badge badge--${todo.visibility.toLowerCase()}`}>{getVisibilityLabel(todo.visibility)}</span>
                </div>
                <span className={`todo-list__status ${todo.completed ? 'is-done' : ''}`} aria-hidden="true">
                  {todo.completed ? 'OK' : ''}
                </span>
              </li>
            ))}
          </ul>
          <button className="todo-list__action" type="button">+ Ajouter une tache</button>
        </section>

        <section className="card card--menu">
          <div className="card__header">
            <div className="card__title">
              <span className="card__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z" />
                </svg>
              </span>
              <h2>Menus de la semaine</h2>
            </div>
            <button className="card__menu" type="button" aria-label="Options menus">...</button>
          </div>
          <div className="menu-week">
            <div className="menu-week__label">{data.weeklyMenu.weekLabel}</div>
            <div className="menu-week__days">
              {data.weeklyMenu.days.map((day) => (
                <div key={day.id} className="menu-week__day">
                  <p className="menu-week__day-label">{day.label}</p>
                  {day.entries.map((entry) => (
                    <div key={entry.id} className="menu-week__entry">
                      <div className="menu-week__entry-info">
                        <div className="menu-week__entry-name">
                          {entry.name}
                          {entry.favorite ? <span className="menu-week__star">*</span> : null}
                        </div>
                        <div className="menu-week__entry-meta">{entry.time} · {entry.person}</div>
                      </div>
                      <span
                        className="menu-week__thumb"
                        style={{ backgroundColor: entry.thumbnailColor }}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="menu-recipes">
            <p>Recettes selectionnees</p>
            <div className="menu-recipes__tags">
              {data.recipes.filter((recipe) => recipe.selectedForWeek).map((recipe) => (
                <span key={recipe.id} className="menu-recipes__tag">{recipe.name}</span>
              ))}
            </div>
          </div>
          <button className="card__link" type="button">Voir la liste de courses {'>'}</button>
        </section>

        <section className="dashboard__stats">
          <div className="stat-card">
            <div>
              <p className="stat-card__title">Calendrier</p>
              <p className="stat-card__value">{upcomingEvents}</p>
              <p className="stat-card__subtitle">evenements a venir</p>
            </div>
            <div className="stat-card__bar">
              <span style={{ width: `${Math.min(upcomingEvents * 20, 100)}%` }} />
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-card__title">Todos</p>
              <p className="stat-card__value">{activeTodos}</p>
              <p className="stat-card__subtitle">taches en cours</p>
            </div>
            <div className="stat-card__bar">
              <span style={{ width: `${Math.min(activeTodos * 20, 100)}%` }} />
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-card__title">Recettes</p>
              <p className="stat-card__value">{favoriteRecipes}</p>
              <p className="stat-card__subtitle">recettes favorites</p>
            </div>
            <div className="stat-card__bar">
              <span style={{ width: `${Math.min(favoriteRecipes * 12, 100)}%` }} />
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-card__title">Courses</p>
              <p className="stat-card__value">{data.shopping.items}</p>
              <p className="stat-card__subtitle">articles a acheter</p>
            </div>
            <div className="stat-card__bar">
              <span style={{ width: `${Math.min(data.shopping.items * 12, 100)}%` }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const Home = withFetchTemplate<any, DashboardData>(HomeContent, useFetchDashboard);
