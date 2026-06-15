import React, { useState, useEffect } from "react";
import { getProductHeirarchy } from "../../Utils/dataProductHeirarchy";
import { getGeographyHeirarchy } from "../../Utils/dataGeography";
import { openDatabase, upsertRecord, upgradeDatabaseInstance } from "../../services/IndexedDBUtil";
import { DATABASE_NAME, STORE_NAME } from '../../services/constants'

const DataContext = React.createContext({
  data: null
});

const DataProvider = ({ children }) => {
  const [products, setProducts] = useState({ data: null, is_loading: null });
  const [geography, setGeography] = useState({ data: null, is_loading: null });
  const [isDataloading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const LoadProductsData = async () => {
      setProducts({ data: null, is_loading: true })

      const _productsDataAll = await getProductHeirarchy();
      const { level6, ...__productsData } = _productsDataAll;

      // Save  level6 in IndexedDB
      await openDatabase(DATABASE_NAME, 1, upgradeDatabaseInstance);
      await upsertRecord(DATABASE_NAME, STORE_NAME, {
        id: "SKUS",
        data: level6,
      });
      setProducts({ data: _productsDataAll, is_loading: false }); // Create a new object here
    }

    const LoadGeographyData = async () => {
      setGeography({ data: null, is_loading: true })

      const _geoDataAll = await getGeographyHeirarchy();

      setGeography({ data: _geoDataAll, is_loading: false }); // Create a new object here
    }

    const loadData = async () => {
      setIsDataLoading(true); // Start loading
  
      // Wait for both data loading functions to complete
      await Promise.all([LoadProductsData(), LoadGeographyData()]);
  
      setIsDataLoading(false); // Stop loading after both are done
    };
  
    loadData(); // Call the async loader

  }, [])


  return (
    <DataContext.Provider value={{ products, geography, isDataloading }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext , DataProvider};