import React, { Component } from 'react';
import * as storybook from '@kadira/storybook';
import { setOptions as setOptionsAddon } from '@kadira/storybook-addon-options';
import backgroundsAddon from 'react-storybook-addon-backgrounds';
import infoAddon from '@kadira/react-storybook-addon-info';
import * as knob from '@kadira/storybook-addon-knobs';
import _ from 'lodash';
import defaultConfig from './defaultConfig';
import StyleWrapper from './StyleWrapper';


function config(newConfig = {}) {
  const conf = _.merge({}, defaultConfig, newConfig);
  conf.info && storybook.setAddon(infoAddon);
  conf.options && setOptionsAddon(conf.options);
  conf.knob && storybook.addDecorator(knob.withKnobs);
  conf.backgrounds && storybook.addDecorator(backgroundsAddon(conf.backgrounds));
  conf.isomorphicStyles && storybook.addDecorator(story => (<StyleWrapper children={story()} />));
  conf.modules && wrapModules(conf.modules, module);
}

const storiesOf = (...args) => {
  const res = storybook.storiesOf(...args)
  res.addHtml = (html) => {
    // console.log({html});
    return res.addDecorator((story) => (
      <div>
        {html}
        {story()}
      </div>
    ))
  }
  res.addStyle = (style) => {
    // console.log({style});
    return res.addDecorator((story) => (
      <div>
        <style>{style.toString()}</style>
        {story()}
      </div>
    ))
  }
  return res;
};

const storyParams = {
  action: storybook.action,
  knob,
  storiesOf,
};


function wrapModule(module) {
  if (typeof module === 'function') {
    module(storyParams);
  } else if (typeof module === 'object' && module.__esModule) {
    for (let key in module) { // eslint-disable-line
      module[key](storyParams);
    }
  } else {
    console.log('DO SOMETHING ELSE');
  }
}

function wrapModules(stories, module) {
  return storybook.configure(() => {
    for (let key in stories) { // eslint-disable-line
      wrapModule(stories[key]);
    }
  }, module);
}
const { configure, addDecorator, setAddon } = storybook;
export { configure, addDecorator, setAddon };
// export storybook;
export { wrapModule, wrapModules, storyParams, config, defaultConfig };
