import React, { useContext } from 'react'
import SideMenu from './SideMenu';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import Modal from './Modal';
import LogoutConfirm from './LogoutConfirm';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = React.useState(false);
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = React.useState(false);
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false);
  return (
    <>
      <div className='landing-nav w-full flex items-center justify-between px-6 py-4 md:px-12 bg-[var(--color-bg)]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-30 shadow-sm border-b border-[var(--color-border)] transition-colors duration-300'>
        {/* Menu button only shown on small screens; on desktop sidebar is permanent */}
        <div className='flex items-center gap-4'>
          <button className='block lg:hidden text-[var(--color-text)]' onClick={() => setOpenSideMenu(!openSideMenu)}>
            {openSideMenu ? (<HiOutlineX className='text-2xl' />) : (<HiOutlineMenu className='text-2xl' />)}
          </button>
        </div>

        {/* Right side: show user avatar/name on desktop */}
        <div className='flex items-center gap-3'>
          {user ? (
            <div className='hidden md:flex items-center gap-2 relative'>
              <span className='text-sm font-medium text-[var(--color-text)]'>{user.fullName}</span>

              <Modal isOpen={openLogoutModal} onClose={() => setOpenLogoutModal(false)} title="Logout">
                <LogoutConfirm
                  onCancel={() => setOpenLogoutModal(false)}
                  onLogout={() => {
                    try {
                      localStorage.clear();
                    } catch {
                      // Ignore localStorage errors
                    }
                    clearUser();
                    setOpenLogoutModal(false);
                    navigate('/');
                  }}
                />
              </Modal>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile side menu */}
      {openSideMenu && (
        <div className='fixed inset-0 z-40 lg:hidden'>
          <div className='fixed inset-0 bg-black/50' onClick={() => setOpenSideMenu(false)}></div>
          <div className='fixed top-0 left-0 h-full w-64 bg-[var(--color-bg)] shadow-xl overflow-y-auto border-r border-[var(--color-border)]'>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar