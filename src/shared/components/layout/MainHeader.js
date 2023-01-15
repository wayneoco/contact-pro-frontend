/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth0 } from "@auth0/auth0-react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Logo from "../UIElements/logo";
import ProfileIcon from "../UIElements/profile-icon";
import { useHttpClient } from "../../hooks/http-hook";
import { UserContext } from "../../contexts/user-context";
import Search from "../../components/UIElements/Search";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Contacts", href: "/contacts", current: false },
  { name: "Add", href: "/contacts/new", current: false },
  { name: "Search", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Settings", href: "#" },
];

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const style = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const MainHeader = () => {
  // const { setLoggedInUser, contacts } = useContext(UserContext);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [currentPage, setCurrentPage] = useState(navigation[0]);
  // const { sendRequest } = useHttpClient();
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleNavClick = (item) => {
    if (item.name !== "Search") {
      currentPage.current = !currentPage.current;
      item.current = !item.current;
      setCurrentPage(item);
    } else {
      handleModalOpen();
    }
  };

  // useEffect(() => {
  //   if (!user) return;

  //   (async () => {
  //     const response = await sendRequest(
  //       `${process.env.REACT_APP_BACKEND_URL}/user`,
  //       "POST",
  //       JSON.stringify({
  //         firstName: user.given_name,
  //         lastName: user.family_name,
  //         email: user.email,
  //         auth0Id: user.sub,
  //         image: user.picture,
  //       }),
  //       {
  //         "Content-Type": "application/json; charset=utf-8",
  //       }
  //     );

  //     setLoggedInUser(response.user);
  //   })();
  // }, [user, sendRequest, setLoggedInUser]);

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-slate-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link to="/">
                        <Logo style={{ color: "white" }} />
                      </Link>
                    </div>
                    <div className="ml-5 font-bold text-white">
                      Smarter Contacts
                    </div>
                    <div className="hidden md:block">
                      {isAuthenticated && (
                        <>
                          <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-300 hover:bg-slate-700 hover:text-white",
                                  "px-3 py-2 rounded-md text-sm font-medium"
                                )}
                                aria-current={item.current ? "page" : undefined}
                                onClick={() => handleNavClick(item)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                          <Modal
                            open={modalOpen}
                            onClose={handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <Search closeModal={() => setModalOpen(false)} />
                            </Box>
                          </Modal>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {isAuthenticated && (
                        <button
                          type="button"
                          className="rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      )}

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
                            <span className="sr-only">Open user menu</span>
                            {isAuthenticated ? (
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user.picture}
                                alt=""
                              />
                            ) : (
                              <ProfileIcon />
                            )}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {isAuthenticated &&
                              userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      to={item.href}
                                      className={classNames(
                                        active ? "bg-slate-100" : "",
                                        "block px-4 py-2 text-sm text-slate-700"
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            {isAuthenticated ? (
                              <Menu.Item key="auth">
                                {/* {({ active }) => ( */}
                                <Link
                                  to="/user/logout"
                                  className={classNames(
                                    // active ? "bg-slate-100" : "",
                                    "block px-4 py-2 text-sm text-slate-700"
                                  )}
                                  onClick={() =>
                                    logout({
                                      returnTo: window.location.origin,
                                    })
                                  }
                                >
                                  Sign Out
                                </Link>
                                {/* )} */}
                              </Menu.Item>
                            ) : (
                              <Menu.Item key="auth">
                                {({ active }) => (
                                  <Link
                                    // to="/user/login"
                                    className={classNames(
                                      active ? "bg-slate-100" : "",
                                      "block px-4 py-2 text-sm text-slate-700"
                                    )}
                                    onClick={() => loginWithRedirect()}
                                  >
                                    Sign In
                                  </Link>
                                )}
                              </Menu.Item>
                            )}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-slate-900 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                      onClick={() => handleNavClick(item)}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  {/* <Disclosure.Button */}
                  {/*   key="auth" */}
                  {/*   as="a" */}
                </div>
                <div className="border-t border-slate-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {isAuthenticated ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.picture}
                          alt=""
                        />
                      ) : (
                        <ProfileIcon />
                      )}
                    </div>
                    {isAuthenticated && (
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user.given_name
                            ? user.given_name +
                              " " +
                              user.family_name.split("")[0]
                            : user.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-slate-400">
                          {!!user.given_name && user.email}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {isAuthenticated &&
                      userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          to={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    {isAuthenticated ? (
                      <Disclosure.Button
                        key="auth"
                        // as="a"
                        // href="/user/logout"
                        className="block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
                        onClick={() =>
                          logout({
                            returnTo: window.location.origin,
                          })
                        }
                      >
                        Sign Out
                      </Disclosure.Button>
                    ) : (
                      <Disclosure.Button
                        key="auth"
                        // as={Link}
                        // to="/user/login"
                        className="block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
                        onClick={() => loginWithRedirect()}
                      >
                        Sign In
                      </Disclosure.Button>
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};

export default MainHeader;
