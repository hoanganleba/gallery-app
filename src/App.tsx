import { Component } from 'solid-js';
import { Route, Router, Routes } from '@solidjs/router';
import Home from './pages/Home';
import Folder from './pages/Folder';
import Recents from './pages/Recents';
import WindowDragHandle from './components/WindowDragHandle';
import { StoreContext, store } from './StoreContext';
import Wrapper from './components/Wrapper';
import SideBar from './components/SideBar/Sidebar';

const App: Component = () => {
  return (
    <StoreContext.Provider value={{ store }}>
      <Router>
        <Wrapper>
          <WindowDragHandle />
          <SideBar />
          <div class="max-w-3xl mx-auto h-[calc(100%-theme(space[8]))]">
            <Routes>
              <Route path="/" component={Home} />
              <Route path="/folder/*path" component={Folder} />
              <Route path="/recents" component={Recents} />
            </Routes>
          </div>
        </Wrapper>
      </Router>
    </StoreContext.Provider>
  );
};

export default App;
