import React from "react";
import styled from 'styled-components';
import { useFormContext } from './FormContext';

const Stage3SelectedItems = ({ selectedItems: items, setSelectedItems, zone }) => {
  const { formData, updateFormData } = useFormContext();
  console.log('Stage3SelectedItems render formdata', formData);
  console.log("Stage3SelectedItems render items", items);


  const handleRemove = (id) => {
    const key = zone.zoneId == 1 ? 'products' : 'geography';
    const updatedItems = items.filter((item) => item.id !== id);
    setSelectedItems(updatedItems);
    updateFormData('stage3', {
      ...formData.stage3,
      [key]: updatedItems
    });
  };

  const handleRemoveAll = () => {
    const key = zone.zoneId == 1 ? 'products' : 'geography';
    setSelectedItems([]);
    updateFormData('stage3', {
      ...formData.stage3,
      [key]: []
    });
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState>
        <iconify-icon icon="mdi:checkbox-marked-circle-outline" style={{ fontSize: '40px', color: '#cbd5e1' }}></iconify-icon>
        <p>No items selected</p>
        <span>Select items to see them here</span>
      </EmptyState>
    );
  }

  return (
    <Container>
      <div className="header-row">
        <span className="count">{items.length} item{items.length !== 1 ? 's' : ''} selected</span>
        <button className="remove-all-btn" onClick={handleRemoveAll}>
          <iconify-icon icon="mdi:close-circle-outline"></iconify-icon>
          Remove All
        </button>
      </div>

      <div className="items-scroll">
        {items.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-info">
              <iconify-icon icon="mdi:check-circle" className="check-icon"></iconify-icon>
              <span className="item-name">{item.breadcrumb?.split('\\').pop() || item.breadcrumb}</span>

              {/* <span className="item-name">
                {item.breadcrumb.includes("India")
                  ? item.breadcrumb.split("\\").pop()
                  : item.breadcrumb}
              </span> */}
            </div>
            <button
              className="remove-btn"
              onClick={() => handleRemove(item.id)}
              title="Remove"
            >
              <iconify-icon icon="mdi:close"></iconify-icon>
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Stage3SelectedItems;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  height: 100%;

  p {
    margin: 12px 0 4px 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }

  span {
    font-size: 12px;
    color: #94a3b8;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-bottom: 1px solid #fecaca;
    flex-shrink: 0;
  }

  .count {
    font-size: 12px;
    font-weight: 600;
    color: #404D60;
  }

  .remove-all-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }

    iconify-icon {
      font-size: 14px;
    }
  }

  .items-scroll {
    flex: 1;
    overflow-y: auto;

    /* Show scrollbar only when scrollable */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;

      &:hover {
        background: #94a3b8;
      }
    }

    &:not(:hover)::-webkit-scrollbar {
      width: 0;
    }
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.15s;

    &:hover {
      background: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .check-icon {
    color: #22c55e;
    font-size: 16px;
    flex-shrink: 0;
  }

  .item-name {
    color: #334155;
    font-size: 10px;
    line-height: 1.4;
    overflow: hidden;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 18px;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.15s;
    flex-shrink: 0;

    &:hover {
      background: #fee2e2;
      color: #dc2626;
    }
  }
`;
