import './App.css'
import { PrimaryButton } from './components/atoms/button/PrimaryButton';
import { SecondaryButton } from './components/atoms/button/SecondaryButton';
import { SearchInput } from './components/atoms/molecules/SearchInput';
import { UserCard } from './components/atoms/organisms/user/UserCard';
import "./practice/styles.css";

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
    <div className="app">
      <PrimaryButton>ボタン</PrimaryButton>
      <SecondaryButton>セカンド</SecondaryButton>
      <SearchInput />
      <UserCard user={user}/>
    </div>
  )
}

