// LICENSE_CODE ZON ISC
'use strict'; /*jslint react:true, es6:true*/
import Pure_component from '../../www/util/pub/pure_component.js';
import React from 'react';
import zurl from '../../util/url.js';
import classnames from 'classnames';
import {If} from '/www/util/pub/react.js';
import {Tooltip} from './common.js';
import {get_static_country} from './util.js';

const tooltips = {
    crawler: `Your crawler or bot that systematically browses the web. Connect
        any type of crawler to the Luminati Proxy Manager:
        <ul>
          <li>
            <div>Browser and extension based crawlers</div>
            <div class="browser_icon firefox"/>
            <div class="browser_icon chrome"/>
            <div class="browser_icon safari"/>
            <div class="browser_icon explorer"/>
          </li>
          <li>
            <div>Dedicated crawling solutions</div>
            <div class="logo_icon crawlera"/>
            <div class="logo_icon legs"/>
            <div class="logo_icon import"/>
          </li>
        </ul>`,
    port_numbers: `Defined proxy ports in Luminati Proxy Manager`,
    lpm: `Luminati Proxy Manager - open-source proxy service that holds
        valuble features, such as:
        <ul>
          <li>IP rotation control</li>
          <li>auto retry</li>
          <li>speed optimization</li>
          <li>auto blacklist of bad IPs</li>
          <li>powerful debugging options</li>
        </ul>
        and more. View full list of features by clicking any proxy port in
        the <strong>Proxies</strong> table`,
    super_proxy: `Load balancing servers, that manage the traffic between the
        Luminati Proxy Manager and the peer`,
    peer: `Exit node (IP) - This might be:
        <ul>
          <li>Residential IP - provided through cable modem, DSL or wireless
            router</li>
          <li>Datacetner IP (static)</li>
          <li>Mobile IP - based on a 3G or 4G cellular network</li>
        </ul>`,
    destination: `The target website that the crawler is collcting data from`,
};

class Schema extends Pure_component {
    constructor(props){
        super(props);
        this.state = {form: {}, proxies: []};
    }
    componentDidMount(){
        this.setdb_on('head.proxy_edit.form', (form={})=>{
            this.setState({form: {...form}});
        });
        this.setdb_on('head.proxy_edit.form.port', port=>{
            this.setState({form: {port}});
        });
        this.setdb_on('head.proxy_edit.form.country', country=>{
            this.setState({form: {country}});
        });
        this.setdb_on('head.proxies_running', proxies=>{
            if (proxies)
                this.setState({proxies});
        });
    }
    render(){
        const port = this.state.form&&this.state.form.port;
        return (
            <span className="schema_component">
              <div className="line"/>
              <Layer id="crawler" no_arr>
                Crawler
              </Layer>
              <Proxy_port_layer proxies={this.state.proxies}
                form={this.state.form}/>
              <Layer id="lpm" class_names="port active">
                <div className="icon"/>
                LPM
              </Layer>
              <Layer no_btn id="port_numbers">Port 22225</Layer>
              <Layer id="super_proxy">
                <span className="flag-icon flag-icon-us"/>
                Super Proxy
              </Layer>
              <Layer no_btn id="port_numbers">Port 80, 443</Layer>
              <Layer id="peer">
                <Peer proxies={this.state.proxies} form={this.state.form}/>
                Peer
              </Layer>
              <Layer id="destination">Destination</Layer>
            </span>
        );
    }
}

const Proxy_port_layer = ({proxies, form})=>{
    let label;
    if (form.port)
        label = 'Proxy port '+form.port;
    else if (!proxies.length)
        label = 'Proxy port';
    else if (proxies.length==1)
        label = 'Proxy port '+proxies[0].port;
    else
    {
        label = 'Proxy port '+proxies[0].port+' - '
        +proxies[proxies.length-1].port;
    }
    return <Layer no_btn id="port_numbers">{label}</Layer>;
};

const Layer = ({id, no_btn, no_arr, class_names, children})=>{
    return (
        <div className={classnames('layer', id, class_names)}>
          <Tooltip placement="bottom" title={tooltips[id]}>
            <span>
              <If when={!no_btn}>
                <If when={!no_arr}><div className="arr"/></If>
                <div className="layer_btn">{children}</div>
              </If>
              <If when={no_btn}>
                {children}
              </If>
            </span>
          </Tooltip>
        </div>
    );
};

const Peer = ({proxies, form})=>{
    if (form.port)
        return <Flag proxy={form}/>;
    else if (!proxies.length)
        return <Flag/>;
    let countries = proxies.map(proxy=>{
        let country = get_static_country(proxy);
        if (!country||country=='any'||country=='*')
            country = proxy.country;
        if (!country||country=='any'||country=='*')
            country = false;
        return country;
    });
    countries = [...new Set(countries)];
    if (countries.length > 1)
        return <Flag/>;
    return <Flag proxy={proxies[0]}/>;
};

const Flag = ({proxy={}})=>{
    let country = get_static_country(proxy);
    if (!country||country=='any'||country=='*')
        country = proxy.country;
    if (country&&country!='any'&&country!='*')
        return <span className={'flag-icon flag-icon-'+country}/>;
    else
        return <img className="globe" src="/img/flag_any_country.svg"/>;
};

export default Schema;
