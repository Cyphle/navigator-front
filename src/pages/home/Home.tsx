import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template.tsx';
import { DashboardData, ItemVisibility } from '../../stores/dashboard/dashboard.types.ts';
import { useFetchDashboard } from '../../stores/dashboard/dashboard.queries.ts';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckSquare, List, ArrowRight, MoreHorizontal, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const getVisibilityLabel = (visibility: ItemVisibility) => {
  return visibility === 'PERSONAL' ? 'Personnel' : 'Famille';
}

const HomeContent = ({ data }: { data: DashboardData }) => {
  const upcomingEvents = data.agenda.length;
  const activeTodos = data.todos.filter((todo) => !todo.completed).length;
  const favoriteRecipes = data.recipes.filter((recipe) => recipe.favorite).length;

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Agenda Section */}
        <Card className="rounded-none border-gray-200 shadow-none xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 text-blue-500">
                <Calendar className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-light uppercase tracking-widest m-0">Agenda familial</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="list-none p-0 m-0 divide-y divide-gray-50">
              {data.agenda.map((event) => (
                <li key={event.id} className="px-6 py-4 flex items-start gap-4 hover:bg-white transition-colors">
                  <span className="w-1 h-12 shrink-0" style={{ backgroundColor: event.accentColor }} aria-hidden="true" />
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="text-sm font-light text-black m-0">{event.title}</p>
                    <p className="text-[10px] text-gray-400 font-light tracking-wider m-0 uppercase">{event.time} · {event.person}</p>
                    <div className="mt-1">
                      <Badge variant="outline" className={cn(
                        "rounded-none text-[8px] font-light uppercase tracking-[0.15em] px-1.5 py-0 border-gray-100",
                        event.visibility === 'FAMILY' ? "text-blue-500 border-blue-100" : "text-gray-400"
                      )}>
                        {getVisibilityLabel(event.visibility)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {event.attendees.slice(0, 2).map((name) => (
                      <Avatar key={name} className="w-6 h-6 border border-white">
                        <AvatarFallback className="text-[8px] bg-gray-100 font-light">{name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {event.attendees.length > 2 && (
                      <div className="w-6 h-6 rounded-full bg-gray-50 border border-white flex items-center justify-center text-[8px] font-light text-gray-400">
                        +{event.attendees.length - 2}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-6 border-t border-gray-50">
            <Button variant="ghost" className="w-full justify-between text-[10px] uppercase tracking-[0.2em] font-light hover:bg-gray-50 transition-colors">
              Voir le calendrier
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Todos Section */}
        <Card className="rounded-none border-gray-200 shadow-none xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 text-white">
                <CheckSquare className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-light uppercase tracking-widest m-0">Todos familiaux</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="list-none p-0 m-0 divide-y divide-gray-50">
              {data.todos.map((todo) => (
                <li key={todo.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white transition-colors">
                  <Avatar className="w-8 h-8 rounded-none border border-gray-100">
                    <AvatarFallback className="text-[10px] bg-white text-black font-light">{todo.assignee.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex flex-col gap-1">
                    <p className={cn("text-sm font-light text-black m-0", todo.completed && "line-through text-gray-300")}>{todo.label}</p>
                    <Badge variant="outline" className={cn(
                      "w-fit rounded-none text-[8px] font-light uppercase tracking-[0.15em] px-1.5 py-0 border-gray-100",
                      todo.visibility === 'FAMILY' ? "text-blue-500 border-blue-100" : "text-gray-400"
                    )}>
                      {getVisibilityLabel(todo.visibility)}
                    </Badge>
                  </div>
                  {todo.completed && (
                    <div className="w-4 h-4 bg-blue-500 flex items-center justify-center text-[8px] text-white">
                      OK
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-6 border-t border-gray-50">
            <Button variant="outline" className="w-full rounded-none border-dashed border-gray-300 text-[10px] uppercase tracking-[0.2em] font-light hover:bg-gray-50 text-gray-400">
              <Plus className="w-3 h-3 mr-2" />
              Ajouter une tache
            </Button>
          </CardFooter>
        </Card>

        {/* Weekly Menus Section */}
        <Card className="rounded-none border-gray-200 shadow-none xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 text-black">
                <List className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-light uppercase tracking-widest m-0">Menus de la semaine</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="border-l-2 border-blue-500 pl-4 py-2">
              <p className="text-[10px] uppercase tracking-[0.2em] font-light text-blue-500 mb-1">Période actuelle</p>
              <p className="text-lg font-extralight text-black m-0">{data.weeklyMenu.weekLabel}</p>
            </div>
            
            <div className="space-y-4">
              {data.weeklyMenu.days.map((day) => (
                <div key={day.id} className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-light text-gray-300">{day.label}</p>
                  <div className="space-y-2 pl-2">
                    {day.entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between bg-white p-3 border border-gray-50 group hover:border-gray-200 transition-colors">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-light text-black flex items-center gap-1">
                            {entry.name}
                            {entry.favorite && <Star className="w-3 h-3 text-blue-500 fill-blue-500" />}
                          </div>
                          <p className="text-[10px] text-gray-400 font-light tracking-wide uppercase m-0">{entry.time} · {entry.person}</p>
                        </div>
                        <div 
                          className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" 
                          style={{ backgroundColor: entry.thumbnailColor }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-50">
              <p className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-400 mb-3">Recettes selectionnees</p>
              <div className="flex flex-wrap gap-2">
                {data.recipes.filter((recipe) => recipe.selectedForWeek).map((recipe) => (
                  <Badge key={recipe.id} variant="secondary" className="rounded-none font-light text-[10px] bg-gray-50 text-gray-600 hover:bg-gray-100 border-none transition-colors">
                    {recipe.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t border-gray-50">
            <Button variant="ghost" className="w-full justify-between text-[10px] uppercase tracking-[0.2em] font-light hover:bg-gray-50 transition-colors">
              Voir la liste de courses
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 xl:col-span-3">
          {[
            { title: "Calendrier", value: upcomingEvents, subtitle: "evenements a venir", color: "bg-blue-500", progress: Math.min(upcomingEvents * 20, 100) },
            { title: "Todos", value: activeTodos, subtitle: "taches en cours", color: "bg-black", progress: Math.min(activeTodos * 20, 100) },
            { title: "Recettes", value: favoriteRecipes, subtitle: "recettes favorites", color: "bg-gray-300", progress: Math.min(favoriteRecipes * 12, 100) },
            { title: "Courses", value: data.shopping.items, subtitle: "articles a acheter", color: "bg-gray-100", progress: Math.min(data.shopping.items * 12, 100) }
          ].map((stat, i) => (
            <Card key={i} className="rounded-none border-gray-200 shadow-none p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-400 mb-2">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extralight text-black">{stat.value}</span>
                  <span className="text-[10px] font-light text-gray-400 uppercase tracking-widest">{stat.subtitle}</span>
                </div>
              </div>
              <div className="mt-6">
                <Progress value={stat.progress} className="h-[2px] rounded-none bg-gray-100" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Home = withFetchTemplate<any, DashboardData>(HomeContent, useFetchDashboard);
