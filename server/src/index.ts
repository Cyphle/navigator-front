import { accountPlugin } from './plugins/account/account.plugin';
import { decorateWithUser } from './authentication.decorator';
import { initFastify } from './config/fastify.config';
import { decorateWithDatabase } from './database/database.decorator';
import { profilePlugin } from './plugins/profile/profile.plugin';
import { loginPlugin } from './plugins/login/login.plugin';
import { userPlugin } from './plugins/user/user.plugin';
import { securityPlugin } from './plugins/security/security.plugin';
import { dashboardPlugin } from './plugins/dashboard/dashboard.plugin';
import { familiesPlugin } from './plugins/families/families.plugin';
import { recipesPlugin } from './plugins/recipes/recipes.plugin';
import { plannedMenusPlugin } from './plugins/planned-menus/planned-menus.plugin';
import { shoppingListsPlugin } from './plugins/shopping-lists/shopping-lists.plugin';
import { familyTodosPlugin } from './plugins/family-todos/family-todos.plugin';
import { calendarsPlugin } from './plugins/calendars/calendars.plugin';

const fastify = initFastify(
  [decorateWithUser, decorateWithDatabase],
  [
    { plugin: profilePlugin, routesPrefix: '/profiles' },
    { plugin: accountPlugin, routesPrefix: '/accounts' },
    { plugin: loginPlugin, routesPrefix: '/login' },
    { plugin: userPlugin, routesPrefix: '/user' },
    { plugin: securityPlugin, routesPrefix: '' },
    { plugin: dashboardPlugin, routesPrefix: '/dashboard' },
    { plugin: familiesPlugin, routesPrefix: '/families' },
    { plugin: recipesPlugin, routesPrefix: '/recipes' },
    { plugin: plannedMenusPlugin, routesPrefix: '' },
    { plugin: shoppingListsPlugin, routesPrefix: '' },
    { plugin: familyTodosPlugin, routesPrefix: '' },
    { plugin: calendarsPlugin, routesPrefix: '' }
  ]
);

const start = async () => {
  try {
    await fastify.listen({ port: 9000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();
