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
  CheckboxGroup,
  Checkbox,
  useDisclosure,
  IconButton,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddRowModalDevelopment = ({ onAddRow }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newRow, setNewRow] = useState({
    name: '',
    tech: [],
    date: '',
    progress: 0,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'progress') {
      const progressValue = Math.min(100, Math.max(0, value));
      setNewRow((prevRow) => ({ ...prevRow, [name]: progressValue }));
    } else {
      setNewRow((prevRow) => ({ ...prevRow, [name]: value }));
    }
  };

  const handleTechChange = (tech) => {
    setNewRow((prevRow) => ({ ...prevRow, tech }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!newRow.name) tempErrors.name = "Name is required.";
    if (newRow.tech.length === 0) tempErrors.tech = "At least one tech is required.";
    if (!newRow.date) tempErrors.date = "Date is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddRow = () => {
    if (validate()) {
      onAddRow(newRow);
      setNewRow({ name: '', tech: [], date: '', progress: 0 });
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
              <Input name="name" value={newRow.name} onChange={handleChange} />
              {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.tech}>
              <FormLabel>Tech</FormLabel>
              <CheckboxGroup value={newRow.tech} onChange={handleTechChange}>
                <Checkbox mr={5} value="apple">Apple</Checkbox>
                <Checkbox mr={5} value="android">Android</Checkbox>
                <Checkbox mr={5} value="windows">Windows</Checkbox>
              </CheckboxGroup>
              {errors.tech && <FormErrorMessage>{errors.tech}</FormErrorMessage>}
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

export default AddRowModalDevelopment;
