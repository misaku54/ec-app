import './App.css'
import { PrimaryButton } from './components/atoms/button/PrimaryButton';
import { SecondaryButton } from './components/atoms/button/SecondaryButton';
import { SearchInput } from './components/atoms/molecules/SearchInput';

export const App = () => {
  return (
    <div className="app">
      <PrimaryButton>ボタン</PrimaryButton>
      <SecondaryButton>セカンド</SecondaryButton>
      <SearchInput />
    </div>
  )
}

