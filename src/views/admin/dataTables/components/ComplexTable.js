import {
  Flex,
  Table,
  Progress,
  Icon,
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
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import AddRowModalComplexTable from './CRUD/AddRowModalComplexTable';
import SearchInput from './searchinput/SearchInput';

// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import { DeleteIcon } from "@chakra-ui/icons";

export default function ComplexTable(props) {
  const { columnsData, tableData } = props;
  const toast = useToast();

  const columns = useMemo(() => columnsData, [columnsData]);
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { globalFilter },
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
    setGlobalFilter: setFilter,
    state,
  } = tableInstance;
  state.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const addRow = (newRow) => {
    setData((prevData) => [...prevData, { ...newRow }]);
    toast({
      title: 'Row added.',
      description: 'The row has been added successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const removeRow = (rowIndex) => {
    setData((prevData) => prevData.filter((row, index) => index !== rowIndex));
    toast({
      title: 'Row removed.',
      description: 'The row has been removed successfully.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSearch = (value) => {
    setFilter(value || '');
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
          Complex Table
        </Text>
        <AddRowModalComplexTable onAddRow={addRow} />
      </Flex>
      <Flex px='25px' mb='20px' justify='space-between'>
        <SearchInput
          value={globalFilter}
          onChange={handleSearch}
        />
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
            page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "NAME") {
                      data = (
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "STATUS") {
                      data = (
                        <Flex align='center'>
                          <Icon
                            w='24px'
                            h='24px'
                            me='5px'
                            color={
                              cell.value === "Approved"
                                ? "green.500"
                                : cell.value === "Disable"
                                ? "red.500"
                                : cell.value === "Error"
                                ? "orange.500"
                                : null
                            }
                            as={
                              cell.value === "Approved"
                                ? MdCheckCircle
                                : cell.value === "Disable"
                                ? MdCancel
                                : cell.value === "Error"
                                ? MdOutlineError
                                : null
                            }
                          />
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {cell.value}
                          </Text>
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
                          <Progress
                            variant='table'
                            colorScheme='brandScheme'
                            h='8px'
                            w='108px'
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
