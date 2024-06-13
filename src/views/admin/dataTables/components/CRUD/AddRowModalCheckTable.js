import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  useDisclosure,
  IconButton,
  useToast,
  FormErrorMessage,
  Flex,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddRowModalCheckTable = ({ onAddRow }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newRow, setNewRow] = useState({
    name: ['', false],
    date: '',
    quantity: 0,
    progress: 0,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewRow((prevRow) => ({
        ...prevRow,
        name: [prevRow.name[0], checked],
      }));
    } else if (name === 'progress' || name === 'quantity') {
      const numericValue = Math.max(0, Number(value));
      setNewRow((prevRow) => ({ ...prevRow, [name]: numericValue }));
    } else {
      setNewRow((prevRow) => ({ ...prevRow, [name]: value }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!newRow.name[0]) tempErrors.name = "Name is required.";
    if (!newRow.date) tempErrors.date = "Date is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddRow = () => {
    if (validate()) {
      onAddRow({ ...newRow }); // Ensure a new object is passed
      setNewRow({ name: ['', false], date: '', quantity: 0, progress: 0 });
      setErrors({});
      onClose();
      toast({
        title: "Row added.",
        description: "The new row has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fillProgress = () => {
    setNewRow((prevRow) => ({ ...prevRow, progress: 100 }));
  };

  return (
    <>
      <IconButton colorScheme="brand" icon={<AddIcon />} onClick={onOpen} aria-label="Add Row" />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Row</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Flex align="center">
                <Checkbox
                  isChecked={newRow.name[1]}
                  onChange={handleChange}
                  name="nameCheckbox"
                  colorScheme="brandScheme"
                  mr="10px"
                />
                <Input name="name" value={newRow.name[0]} onChange={(e) => setNewRow((prevRow) => ({ ...prevRow, name: [e.target.value, prevRow.name[1]] }))} />
              </Flex>
              {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.date}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={newRow.date}
                onChange={handleChange}
              />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                name="quantity"
                value={newRow.quantity}
                onChange={handleChange}
                min={0}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Progress</FormLabel>
              <Input
                type="number"
                name="progress"
                value={newRow.progress}
                onChange={handleChange}
                max={100}
                min={0}
              />
              <Button mt={2} colorScheme="teal" onClick={fillProgress}>
                Fill Progress to 100%
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddRow}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRowModalCheckTable;
