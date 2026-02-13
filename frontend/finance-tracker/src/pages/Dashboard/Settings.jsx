import React, { useContext, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/UserContext";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LogoutConfirm from "../../components/layouts/LogoutConfirm";
import Modal from "../../components/layouts/Modal";
import CSVBulkUpload from "../../components/Inputs/CSVBulkUpload";
import { LuDownload } from "react-icons/lu";

const Settings = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profilePic, setProfilePic] = useState(user?.profileImageUrl || null);

    const [isLoading, setIsLoading] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [openClearDataModal, setOpenClearDataModal] = useState(false);
    const [isClearingData, setIsClearingData] = useState(false);

    // Since ProfilePhotoSelector expects a file object for new uploads or string for existing
    // We need to handle it carefully. 
    // If profilePic is a string, it's the URL. If it's an object, it's a new file.

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let profileImageUrl = user?.profileImageUrl;

            // Check if profilePic is a File object (meaning a new image was selected)
            if (profilePic && typeof profilePic === 'object') {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl;
            }

            // Update user info
            // Note: We need to create this endpoint in backend if it doesn't exist
            // or use a generic update user endpoint
            // Assuming we'll add /update-user to auth routes

            // For now, let's implement the backend part in next steps. 
            // We will assume the endpoint will be API_PATHS.AUTH.UPDATE_USER (need to add this too)

            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
                fullName,
                profileImageUrl
            });

            if (response.data && response.data.user) {
                updateUser(response.data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Download Income
    const handleDownloadIncome = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Income_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Income data downloaded successfully");
        } catch (error) {
            console.error("Error downloading income:", error);
            toast.error("Failed to download income data");
        }
    };

    // Handle Download Expense
    const handleDownloadExpense = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Expense data downloaded successfully");
        } catch (error) {
            console.error("Error downloading expense:", error);
            toast.error("Failed to download expense data");
        }
    };

    // Handle Clear All Data
    const handleClearAllData = async () => {
        setIsClearingData(true);
        try {
            // Delete all income
            await axiosInstance.delete("/api/v1/income/delete-all");
            // Delete all expenses
            await axiosInstance.delete("/api/v1/expense/delete-all");

            toast.success("All data cleared successfully");
            setOpenClearDataModal(false);

            // Optionally refresh the page or redirect to dashboard
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            console.error("Error clearing data:", error);
            toast.error("Failed to clear data");
        } finally {
            setIsClearingData(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Settings">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Account Settings</h2>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Profile Settings */}
                    <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">Profile Information</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">

                            <div className="flex flex-col items-center">
                                <ProfilePhotoSelector
                                    image={profilePic}
                                    setImage={setProfilePic}
                                />
                                <p className="text-sm text-gray-500 mt-2">Click to change profile photo</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    label="Full Name"
                                    placeholder="Your Name"
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    disabled={isLoading}
                                />

                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="Email"
                                    placeholder="Your Email"
                                    id="email"
                                    name="email"
                                    type="email"
                                    disabled={true} // Email usually not efficient to change without verification
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Data Management Section */}
                    <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">Data Management</h3>

                        <div className="space-y-6">
                            {/* Download Section */}
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text)] mb-3">Export Financial Data</p>
                                <p className="text-xs text-[var(--color-text)] opacity-60 mb-4">Download your income and expense records as Excel files</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={handleDownloadIncome}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition shadow-sm hover:shadow-md"
                                    >
                                        <LuDownload className="text-lg" />
                                        <span>Income Data</span>
                                    </button>
                                    <button
                                        onClick={handleDownloadExpense}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition shadow-sm hover:shadow-md"
                                    >
                                        <LuDownload className="text-lg" />
                                        <span>Expense Data</span>
                                    </button>
                                </div>
                            </div>

                            {/* Upload Section */}
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text)] mb-3">Import Transactions</p>
                                <p className="text-xs text-[var(--color-text)] opacity-60 mb-4">Upload CSV files to bulk import your transactions</p>
                                <CSVBulkUpload
                                    type="Transactions"
                                    apiPath={API_PATHS.TRANSACTION.BULK_UPLOAD}
                                    onUploadComplete={() => toast.success("Transactions imported successfully")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Danger Zone</h3>
                    <p className="text-sm text-[var(--color-text)] opacity-70 mb-4">
                        These actions are irreversible. Please proceed with caution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setOpenClearDataModal(true)}
                            className="px-6 py-2 bg-red-600 text-white border border-red-700 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                        >
                            Clear All Data
                        </button>
                        <button
                            onClick={() => setOpenLogoutModal(true)}
                            className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors w-full sm:w-auto"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Logout Modal */}
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

                {/* Clear Data Modal */}
                <Modal isOpen={openClearDataModal} onClose={() => setOpenClearDataModal(false)} title="Clear All Data">
                    <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">⚠️ Warning: This action cannot be undone!</p>
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                This will permanently delete all your income and expense records. Your account will remain active, but all transaction data will be lost.
                            </p>
                        </div>
                        <p className="text-[var(--color-text)] text-sm">
                            Are you absolutely sure you want to clear all your financial data?
                        </p>
                        <div className="flex gap-3 justify-end pt-2">
                            <button
                                onClick={() => setOpenClearDataModal(false)}
                                disabled={isClearingData}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAllData}
                                disabled={isClearingData}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isClearingData ? "Clearing..." : "Yes, Clear All Data"}
                            </button>
                        </div>
                    </div>
                </Modal>

            </div>
        </DashboardLayout>
    );
};

export default Settings;
