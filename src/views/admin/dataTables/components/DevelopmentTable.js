/* eslint-disable */
import React, { useMemo, useState } from "react";
import {
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  useToast,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card";
import { AndroidLogo, AppleLogo, WindowsLogo } from "components/icons/Icons";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import AddRowModalDevelopment from "./CRUD/AddRowModalDevelopment"; // Import the AddRowModal component
import { DeleteIcon } from '@chakra-ui/icons'; // Import Icons
import SearchInput from "./searchinput/SearchInput"; // Import the SearchInput component

export default function DevelopmentTable(props) {
  const { columnsData, tableData } = props;
  const toast = useToast();

  const columns = useMemo(() => columnsData, [columnsData]);
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { globalFilter }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter: setFilter, // Rename to avoid conflict with useState
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const addRow = (newRow) => {
    setData((prevData) => [...prevData, newRow]);
  };

  const removeRow = (index) => {
    setData((prevData) => prevData.filter((row, i) => i !== index));
    toast({
      title: "Row removed.",
      description: "The row has been removed successfully.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSearch = (value) => {
    setFilter(value || "");
    setGlobalFilter(value);
  };

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Development Table
        </Text>
        <AddRowModalDevelopment onAddRow={addRow} /> {/* Use the AddRowModalDevelopment component */}
      </Flex>
      <Flex px='25px' mb='20px' justify='space-between'>
        <SearchInput
          value={globalFilter}
          onChange={handleSearch} // Use the handleSearch function
        /> {/* Use the SearchInput component */}
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
              <Th borderColor={borderColor}></Th>
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length + 1} textAlign="center">
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  Name not found
                </Text>
              </Td>
            </Tr>
          ) : (
            page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "NAME") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "TECH") {
                      data = (
                        <Flex align='center'>
                          {cell.value.map((item, key) => {
                            if (item === "apple") {
                              return (
                                <AppleLogo
                                  key={key}
                                  color={iconColor}
                                  me='16px'
                                  h='18px'
                                  w='15px'
                                />
                              );
                            } else if (item === "android") {
                              return (
                                <AndroidLogo
                                  key={key}
                                  color={iconColor}
                                  me='16px'
                                  h='18px'
                                  w='16px'
                                />
                              );
                            } else if (item === "windows") {
                              return (
                                <WindowsLogo
                                  key={key}
                                  color={iconColor}
                                  h='18px'
                                  w='19px'
                                />
                              );
                            }
                          })}
                        </Flex>
                      );
                    } else if (cell.column.Header === "DATE") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "PROGRESS") {
                      data = (
                        <Flex align='center'>
                          <Text
                            me='10px'
                            color={textColor}
                            fontSize='sm'
                            fontWeight='700'>
                            {cell.value}%
                          </Text>
                          <Progress
                            variant='table'
                            colorScheme='brandScheme'
                            h='8px'
                            w='63px'
                            value={cell.value}
                          />
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor='transparent'>
                        {data}
                      </Td>
                    );
                  })}
                  <Td borderColor='transparent'>
                    <IconButton 
                      colorScheme="red"
                      icon={<DeleteIcon />} 
                      onClick={() => removeRow(row.index)} 
                      aria-label="Remove Row"
                    />
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
