import React from "react";

class MenuTabs extends React.Component {
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
        <div id="tabContent" className={this.props.style['createworkflowtabcontents'] }>        
          {content}
        </div>

      </div>
    );
  }
}

const TabButtons = ({ buttons, changeTab, activeTab,style }) => {

  return (
    <ul className={`tab-buttons ${style['createworkflowtab']}`}>
      {buttons.map((button,index) => {
        return <li key={button.label} id={button.label} className={button.label === activeTab ? style.selected : ''} 
        // onClick={() => changeTab(button.label)}
        >
          <span>{index+1}</span>
          {button.name}
          </li>
      })}
    </ul>
  )
}

const MenuTab = props => {
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export { MenuTabs, MenuTab }

