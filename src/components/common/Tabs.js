import React from "react";

class Tabs extends React.Component {
  render() {
    let content;
    let buttons = [];
    
    return (
      <div id={this.props.name} className={this.props.style.tabs}>
        {React.Children.map(this.props.children, child => {
          buttons.push({label : child.props.label, name : child.props.name})
          if (child.props.label === this.props.tabState.activeTab) content = child.props.children
        })}

        <TabButtons activeTab={this.props.tabState.activeTab} buttons={buttons} 
        changeTab={this.props.changeHandler} style={this.props.style} />
        <div id="tabContent" className={this.props.style['tab-content']}>
          {/* <div className={tt}>hello</div> */}
          {content}
        </div>

      </div>
    );
  }
}

const TabButtons = ({ buttons, changeTab, activeTab,style }) => {

  return (
    <div className={`tab-buttons ${style['tab-buttons']}`}>
      {buttons.map(button => {
        return <button key={button.label} id={button.label} className={button.label === activeTab ? 'selected' : ''} onClick={() => changeTab(button.label)}>{button.name}</button>
      })}
    </div>
  )
}

const Tab = props => {
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export { Tabs, Tab }

