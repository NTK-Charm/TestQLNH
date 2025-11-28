angular.module('FoodManagementApp', [])
    .controller('FoodManagementCtrl', function ($scope, $http) {
        $scope.foods = [];
        $scope.categories = [];
        $scope.editingFood = null;
        $scope.newFood = {
            status: 'available'
        };

        // Status options
        $scope.statusOptions = [
            { value: 'available', label: 'Có sẵn' },
            { value: 'unavailable', label: 'Không khả dụng' },
            { value: 'out_of_stock', label: 'Hết hàng' }
        ];

        // Lấy danh sách món ăn từ API
        $scope.loadFoods = function () {
            $http.get('/api/foods')
                .then(function (response) {
                    $scope.foods = response.data;
                    console.log('Loaded foods:', $scope.foods);
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải món ăn:', error);
                    alert('Lỗi khi tải danh sách món ăn!');
                });
        };

        // Lấy danh mục
        $scope.loadCategories = function () {
            $http.get('/api/categories')
                .then(function (response) {
                    $scope.categories = response.data;
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh mục:', error);
                    alert('Lỗi khi tải danh mục!');
                });
        };

        // Thêm món ăn mới
        $scope.addFood = function () {
            if (!$scope.newFood.name || !$scope.newFood.price || !$scope.newFood.category) {
                alert('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Giá, Danh mục)');
                return;
            }

            $http.post('/api/foods', $scope.newFood)
                .then(function (response) {
                    $scope.foods.unshift(response.data);
                    $scope.newFood = { status: 'available' };
                    alert('Thêm món ăn thành công!');
                })
                .catch(function (error) {
                    console.error('Lỗi khi thêm món ăn:', error);
                    alert('Lỗi khi thêm món ăn: ' + error.data.error);
                });
        };

        // Chỉnh sửa món ăn
        $scope.editFood = function (food) {
            $scope.editingFood = angular.copy(food);
        };

        // Cập nhật món ăn
        $scope.updateFood = function () {
            $http.put('/api/foods/' + $scope.editingFood._id, $scope.editingFood)
                .then(function (response) {
                    var index = $scope.foods.findIndex(f => f._id === $scope.editingFood._id);
                    $scope.foods[index] = response.data;
                    $scope.cancelEdit();
                    alert('Cập nhật món ăn thành công!');
                })
                .catch(function (error) {
                    console.error('Lỗi khi cập nhật món ăn:', error);
                    alert('Lỗi khi cập nhật món ăn: ' + error.data.error);
                });
        };

        // Xóa món ăn
        $scope.deleteFood = function (foodId) {
            if (confirm('Bạn có chắc muốn xóa món ăn này?')) {
                $http.delete('/api/foods/' + foodId)
                    .then(function (response) {
                        $scope.foods = $scope.foods.filter(f => f._id !== foodId);
                        alert('Xóa món ăn thành công!');
                    })
                    .catch(function (error) {
                        console.error('Lỗi khi xóa món ăn:', error);
                        alert('Lỗi khi xóa món ăn: ' + error.data.error);
                    });
            }
        };

        // Get status label
        $scope.getStatusLabel = function (status) {
            const statusObj = $scope.statusOptions.find(s => s.value === status);
            return statusObj ? statusObj.label : status;
        };

        // Get status class for styling
        $scope.getStatusClass = function (status) {
            switch (status) {
                case 'available': return 'status-available';
                case 'unavailable': return 'status-unavailable';
                case 'out_of_stock': return 'status-out-of-stock';
                default: return '';
            }
        };

        $scope.cancelEdit = function () {
            $scope.editingFood = null;
        };

        // Khởi tạo
        $scope.loadFoods();
        $scope.loadCategories();
    });