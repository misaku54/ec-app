import './App.css';
import { Router } from './practice/router/Router';
import "./practice/styles.css";
import { UserProvider } from './providers/UserProvider';

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
    <UserProvider>
      <Router />
    </UserProvider>
  )
}

