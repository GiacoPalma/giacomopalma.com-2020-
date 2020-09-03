import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import About from './components/About';
import FetchData from './components/FetchData';

import './custom.css'
import Projects from "./components/Projects";
import Blog from "./components/Blog";
import Contact from "./components/Contact";

export default () => (
    <Layout>
        <Route exact path='/' key="home"/>
        <Route path='/about' component={ About } key="about" />
        <Route path='/projects' component={ Projects } key="projects"/>
        <Route path='/blog' component={ Blog } key="blog"/>
        <Route path='/contact' component={ Contact } key="contact"/>
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} key="fetch"/>
    </Layout>
);
