import { ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';
import { UserContextProvider } from './contexts/user/user.context.tsx';
import { Option, some } from './helpers/option.ts';
import './main.scss';
import { Footer } from './shared/footer/Footer.tsx';
import { Header } from './shared/header/Header.tsx';
import { UserInfo } from './stores/user/user.types.ts';
import { PRIMARY_COLOR } from './theme-variables.ts';

// TODO c'est pour load des data avant le chargement de la page
export async function appLoader() {
  return {};
}

const SiteContent = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  return (
    <UserContextProvider>
      <ConfigProvider theme={ { token: { colorPrimary: PRIMARY_COLOR } } }>
          <Header userInfo={userInfo}/>

          <Outlet/>

          <Footer/>
        </ConfigProvider>
    </UserContextProvider>
  )
}

const Main = () => {
  // const { isPending, isError, data, error } = useUserInfo();
  const data = some({
    username: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  // TODO faut remettre comme avant
  return (
    <>
      {/* {isPending ? (
        <span>Loading...</span>
      ) : isError ? (
        <span>Error: { error.message }</span>
      ) : (
        <SiteContent userInfo={data as Option<UserInfo>}/>
      )} */}
      <SiteContent userInfo={data as Option<UserInfo>}/>
    </>
  )
}

export default Main;
