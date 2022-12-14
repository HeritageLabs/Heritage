/* eslint-disable no-implied-eval */
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import CustomButton from "../common/CustomButton";
import { useEffect, useState } from "react";
import { Spinner, toaster } from "evergreen-ui";
import TextInput from "../common/TextInput";
import { useNavigate } from "react-router-dom";
import getUserInterval, { checkIn } from "../utils/helpers";
import Navbar from "../navbar/navbar";
import {
  checkConnection,
  isDisconnected,
  addTokens,
} from "../utils/helpers.js";
import { editIcon, loadingWhite } from "../utils/svg";

const CheckInterval = () => {
  const navigate = useNavigate();
  const [heir, setHeir] = useState();
  const [interval, setInterval] = useState();
  const [lastSeen, setLastSeen] = useState();
  const [checkInLoading, setCheckInLoading] = useState(false);
  // const [loadingProfile, setLoadingProfile] = useState(true);

  const getHeritage = async () => {
    console.log(await checkConnection());
    const heritage = await getUserInterval(await checkConnection());
    console.log(heritage);
    setInterval(heritage.interval);
    setLastSeen(heritage.lastSeen);
    setHeir(heritage.heir);
  };

  useEffect(() => {
    getHeritage();
  }, []);

  const checkInNow = async (e) => {
    e.preventDefault();
    setCheckInLoading(true);
    try {
      await checkIn();
      setCheckInLoading(false);
    } catch (error) {
      toaster.danger("An error occured!");
      setCheckInLoading(false);
      return;
    }
    navigate("/success");
  };

  return (
    <Box
      padding={{ base: "10px 40px", lg: "30px 80px" }}
      bg="#02044A"
      minH="100vh"
    >
      <Navbar />
      <Box p={{ base: "15px 10px", lg: "15px 50px" }} margin="50px 0">
        <Box
          mb="40px"
          display={{ base: "block", lg: "flex" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text
              color="white"
              fontSize={{ base: "20px", lg: "50px" }}
              fontWeight="black"
            >
              Your Profile
            </Text>
            <Text color="brand.teal" fontSize="14px">
              You are viewing this page because you have created a heritage
              account with us.
            </Text>
          </Box>
          <Box
            d="flex"
            justifyContent="flex-end"
            alignSelf="flex-end"
            mt={{ base: "10px" }}
          >
            <CustomButton
              w={{ base: "90%", lg: "99%" }}
              d="flex"
              bg="none"
              hoverColor="brand.white"
              color="brand.white"
              hover="brand.teal"
              border="1px solid #15F4CB"
              h="45px"
              onClick={() => navigate("/select-token")}
            >
              Add Token
            </CustomButton>
          </Box>
        </Box>
        <Box h="1px" bgColor="brand.grey"></Box>
        {heir ? (
          <>
            <Box mt="20px">
                <Flex
                  alignItems="center"
                  mb="20px"
                  cursor="pointer"
                  w="fit-content"
                  onClick={() => navigate('/get-started')}
                >
                  <Box mr="10px">{editIcon}</Box>
                  <Text
                    color="brand.white"
                    fontSize="14px"
                    _hover={{ color: "brand.teal" }}
                  >
                    Edit profile
                  </Text>
                </Flex>
              {/* </a> */}
              <Box h="1px" bgColor="brand.grey"></Box>
              <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ lg: "42" }}
                mt={{ base: "0", lg: "20px" }}
              >
                <TextInput
                  color="brand.white"
                  bg="none"
                  label="Next of kin Wallet"
                  value={heir}
                  borderColor="brand.grey"
                  isReadonly
                />
                <TextInput
                  color="brand.white"
                  bg="none"
                  label="CheckIn Interval"
                  value={interval}
                  borderColor="brand.grey"
                />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="42">
                <TextInput
                  color="brand.white"
                  bg="none"
                  label="Last seen"
                  value={lastSeen}
                  borderColor="brand.grey"
                />
              </SimpleGrid>
            </Box>
            <Box mt="40px">
              <CustomButton
                w={{ base: "90%", lg: "60%" }}
                d="flex"
                m="10px auto"
                bg="#15F4CB"
                hover="none"
                border="1px solid #15F4CB"
                hoverColor="brand.teal"
                color="brand.white"
                isLoading={checkInLoading}
                onClick={checkInNow}
              >
                Check In
              </CustomButton>
            </Box>
          </>
        ) : (
          loadingWhite
        )}
      </Box>
    </Box>
  );
};

export default CheckInterval;
