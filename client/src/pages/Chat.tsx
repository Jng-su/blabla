import { useSignOutMutation } from "../query/mutation/auth";
import { useAuthStatusQuery } from "../query/queries/auth";

export default function Chat() {
  const { data } = useAuthStatusQuery();
  const isAuthenticated = data?.isAuthenticated || false;
  const signOutMutation = useSignOutMutation();

  // 더미 친구 데이터
  const friends = [
    { id: 1, name: "김철수" },
    { id: 2, name: "이영희" },
    { id: 3, name: "박민수" },
    { id: 4, name: "최지은" },
    { id: 5, name: "정수현" },
    { id: 6, name: "한지민" },
  ];

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (err) {
      alert("로그아웃에 실패했습니다.");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div>
      <div>
        <h2>Friends</h2>
        <div>
          {friends.map((friend) => (
            <div key={friend.id}>
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1>Chat Room</h1>
        <div>
          <p>Welcome to the chat!</p>
        </div>
        <div>
          <input type="text" placeholder="Type a message..." />
          <button onClick={handleSignOut} disabled={signOutMutation.isPending}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
