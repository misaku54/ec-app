import './App.css'
import { PrimaryButton } from './components/atoms/button/PrimaryButton';
import { SecondaryButton } from './components/atoms/button/SecondaryButton';
import { SearchInput } from './components/molecules/SearchInput';
import { UserCard } from './components/organisms/user/UserCard';
import { HeaderOnly } from './components/templates/HeaderOnly';
import { DefaultLayout } from './components/templates/DefaultLayout';
import "./practice/styles.css";
import { BrowserRouter } from "react-router";
import { Router } from './router/Router';

const user = {
  name: "name1",
  image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
  email: "12345@example.com",
  phone: "090-1111-2222",
  company: {
    name: "テスト株式会社"
  },
  website: "https://google.com"
};

export const App = () => {
  return (
    <Router />
  )
}

